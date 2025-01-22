import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import {MatFormFieldControl, MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import {MatIconModule} from '@angular/material/icon';
import {MatCheckboxModule} from '@angular/material/checkbox'
import {MatButtonModule} from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import {MatRadioModule} from '@angular/material/radio';

@Component({
  selector: 'app-exam-content',
  standalone: true,
  imports: [
    CommonModule,
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
  styleUrl: './exam-content.component.css'
})
export class ExamContentComponent {
  examForm = this.fb.group({
    questions: this.fb.array([])
  });

  questionTypeControl = new FormControl('single'); // Control para seleccionar el tipo de pregunta

  constructor(private fb: FormBuilder) {}

  // Obtener el FormArray de preguntas
  get questions(): FormArray {
    return this.examForm.get('questions') as FormArray;
  }

  // Agregar una nueva pregunta al FormArray
  addQuestion(): void {
    const questionType = this.questionTypeControl.value;
    const newQuestion = this.fb.group({
      questionText: ['', Validators.required],
      type: [questionType, Validators.required],
      options: this.fb.array([]), // Inicializa las opciones como un FormArray
      correctAnswers: questionType === 'multiple' ? this.fb.array([]) : this.fb.control('', Validators.required) // FormArray o FormControl según el tipo
    });

    this.questions.push(newQuestion);
  }

  // Eliminar una pregunta
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
    const index = correctAnswers.controls.findIndex(ctrl => ctrl.value === option);

    if (index === -1) {
      correctAnswers.push(this.fb.control(option));
    } else {
      correctAnswers.removeAt(index);
    }
  }

  // Guardar el examen
  saveExam(): void {
    console.log('Examen guardado:', this.examForm.value);
    // Aquí podrías enviar los datos al backend para guardarlos en la base de datos
  }
}