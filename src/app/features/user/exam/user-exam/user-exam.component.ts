import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ExamsService } from '../../../../core/services/exams/exams.service';
import { CommonModule } from '@angular/common';
import {MatRadioModule} from '@angular/material/radio';
import {MatInputModule} from '@angular/material/input';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatButtonModule} from '@angular/material/button';
import { AuthService } from '../../../../core/services/auth/auth.service';
import { ProgressService } from '../../../../core/services/progress/progress.service';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-user-exam',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatRadioModule, MatInputModule, MatCheckboxModule, MatButtonModule, MatIconModule, MatCardModule],
  templateUrl: './user-exam.component.html',
  styleUrl: './user-exam.component.css'
})
export class UserExamComponent implements OnInit {
  form!: FormGroup;
  questions?: any[] = [];
  currentIndex = 0;

  constructor(private fb: FormBuilder, private examsService: ExamsService, private authService: AuthService,
    private progressService: ProgressService, private router: Router,
  ) {}

  ngOnInit(): void {
    // Obtener datos adicionales
    const userId = this.authService.getUserId();
    const userType = this.authService.getUserType();
    const examId = history.state.id;

    // Crear el formulario y agregar los datos adicionales
    this.form = this.fb.group({
      userId: [userId], // Agregar userId al formulario
      type: ['exam'], // Agregar userType al formulario
      referenceId: [examId], // Agregar examId al formulario
      answers: this.fb.array([]), // Inicializar answers como un FormArray vacío
    });
    // Obtener las preguntas del examen
    this.examsService.findOne(examId).subscribe((res) => {
      this.questions = res.questions;
      if (this.questions) {
        const answersArray = this.questions.map((q) => this.createAnswerGroup(q));
        this.form.setControl('answers', this.fb.array(answersArray)); // Reemplazar el FormArray de answers
      }
    });
  }

  // Crear grupo de respuestas según el tipo de pregunta
  createAnswerGroup(question: any): FormGroup {
    if (question.type === 'single') {
      return this.fb.group({
        questionId: [question.id],
        answer: ['', Validators.required], // Campo obligatorio
      });
    } else if (question.type === 'multiple') {
      return this.fb.group({
        questionId: [question.id],
        answers: this.fb.array([], Validators.required), // Respuesta múltiple obligatoria
      });
    } else if (question.type === 'open') {
      return this.fb.group({
        questionId: [question.id],
        answer: ['', Validators.required], // Campo obligatorio
      });
    }
    throw new Error('Unknown question type');
  }

  // Obtener respuestas del FormArray
  get answers(): FormArray {
    return this.form.get('answers') as FormArray;
  }

  // Manejar cambios en los checkboxes
  onCheckboxChange(event: any, index: number): void {
    const answersArray = this.answers.at(index).get('answers') as FormArray;
    if (event.checked) {
      answersArray.push(this.fb.control(event.source.value));
    } else {
      const i = answersArray.controls.findIndex((ctrl) => ctrl.value === event.source.value);
      if (i > -1) {
        answersArray.removeAt(i);
      }
    }
  }

  // Enviar el formulario
  onSubmit(): void {
    if (this.form.valid) {
      console.log('Formulario enviado:', this.form.value);
      this.progressService.createProgress(this.form.value).subscribe(res=> {
        console.log(res);
      })
    } else {
      this.form.markAllAsTouched();
      console.error('Formulario inválido');
    }
  }

  goBack(): void {
    this.router.navigate(['/modulos/i/games']); // Redirige a la ruta anterior
  }

  get currentQuestion() {
    return this.questions![this.currentIndex];
  }
  
  nextQuestion() {
    if (this.currentIndex < this.questions!.length - 1) {
      this.currentIndex++;
    }
  }
  
  prevQuestion() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
    }
  }
}
