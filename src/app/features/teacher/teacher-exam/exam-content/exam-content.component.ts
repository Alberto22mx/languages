
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { FormArray, FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import {MatIconModule} from '@angular/material/icon';
import {MatCheckboxModule} from '@angular/material/checkbox'
import {MatButtonModule} from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import {MatRadioModule} from '@angular/material/radio';
import { Location } from '@angular/common';
import { ExamsService } from '../../../../core/services/exams/exams.service';

@Component({
    selector: 'app-exam-content',
    imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    MatInputModule,
    MatIconModule,
    MatCheckboxModule,
    MatRadioModule
],
    templateUrl: './exam-content.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    styleUrl: './exam-content.component.css'
})
export class ExamContentComponent implements OnInit {
  examData: any = null; // Datos del examen para editar
  private questionIdCounter: number = 0; // Contador para generar IDs únicos

  examForm = this.fb.group({
    questions: this.fb.array([]),
  });

  questionTypeControl = new FormControl('single'); // Control para seleccionar el tipo de pregunta

  constructor(private fb: FormBuilder, private location: Location, private examsService: ExamsService) {}

  // Obtener el FormArray de preguntas
  get questions(): FormArray {
    return this.examForm.get('questions') as FormArray;
  }

  ngOnInit(): void {
    // Extraer datos del estado de la navegación
    
    const navigation = history;
    if (navigation?.state) {
      this.questionIdCounter = 1 + navigation.state.questions.length;
      this.examData = navigation.state;
      this.loadExamData(this.examData);
    }
  }

  // Cargar datos del examen en el formulario
  private loadExamData(data: any): void {
    this.examForm.patchValue({});

    data.questions.forEach((question: any) => {
      const questionGroup = this.fb.group({
        id: [question.id || this.generateQuestionId()], // Generar un ID único si no existe
        questionText: [question.questionText || '', Validators.required],
        type: [question.type || 'single', Validators.required],
        options: this.fb.array(question.options || []), // Inicializar las opciones si existen
        correctAnswers: question.type === 'multiple'
          ? this.fb.array(question.correctAnswers || [])
          : this.fb.control(question.correctAnswers || (question.options?.[0] || ''), Validators.required),
      });

      this.questions.push(questionGroup);
    });
  }

  // Generar un ID único para cada pregunta
  private generateQuestionId(): number {
    return this.questionIdCounter++;
  }

  // Agregar una nueva pregunta al FormArray
  addQuestion(): void {
    const questionType = this.questionTypeControl.value;

    const newQuestion = this.fb.group({
      id: [this.generateQuestionId()], // Generar un ID único
      questionText: ['', Validators.required],
      type: [questionType, Validators.required],
      options: this.fb.array([]), // Inicializar las opciones como un FormArray vacío
      correctAnswers:
        questionType === 'multiple'
          ? this.fb.array([])
          : this.fb.control('', Validators.required), // Inicializar según el tipo de pregunta
    });

    // Inicializar la respuesta correcta si es de tipo "single" y tiene opciones
    if (questionType === 'single') {
      const optionsArray = newQuestion.get('options') as FormArray;
      // Escuchar cambios en las opciones y ajustar el valor inicial si es necesario
      optionsArray.valueChanges.subscribe((options: string[]) => {
        if (options.length > 0) {
          newQuestion.get('correctAnswers')?.setValue(options[0], { emitEvent: false });
        }
      });
    }

    this.questions.push(newQuestion);
  }

  // Eliminar una pregunta del FormArray
  removeQuestion(index: number): void {
    this.questions.removeAt(index);
  }

  // Obtener las opciones de una pregunta específica
  getOptions(questionIndex: number): FormArray {
    return this.questions.at(questionIndex).get('options') as FormArray;
  }

  // Agregar una opción a una pregunta
  addOption(questionIndex: number): void {
    const optionsArray = this.getOptions(questionIndex);
    optionsArray.push(this.fb.control('', Validators.required));
  }

  // Eliminar una opción de una pregunta
  removeOption(questionIndex: number, optionIndex: number): void {
    const optionsArray = this.getOptions(questionIndex);
    optionsArray.removeAt(optionIndex);
  }

  // Manejar selección de respuestas correctas (checkbox)
  toggleCorrectAnswer(questionIndex: number, option: string): void {
    const correctAnswers = this.questions.at(questionIndex).get('correctAnswers') as FormArray;
    const index = correctAnswers.controls.findIndex((ctrl) => ctrl.value === option);

    if (index === -1) {
      correctAnswers.push(this.fb.control(option));
    } else {
      correctAnswers.removeAt(index);
    }
  }

  // Guardar el examen editado
  saveExam(): void {
    this.examsService.update(this.examData.id, this.examForm.value).subscribe();
  }

  goBack(): void {
    this.location.back(); // Regresa a la página anterior
  }
}
