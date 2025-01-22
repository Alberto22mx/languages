import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ExamsService } from '../../../../core/services/exams/exams.service';
import { CommonModule } from '@angular/common';
import {MatRadioModule} from '@angular/material/radio';
import {MatInputModule} from '@angular/material/input';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatButtonModule} from '@angular/material/button';

@Component({
  selector: 'app-user-exam',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatRadioModule, MatInputModule, MatCheckboxModule, MatButtonModule],
  templateUrl: './user-exam.component.html',
  styleUrl: './user-exam.component.css'
})
export class UserExamComponent implements OnInit {
  form!: FormGroup;

  // Preguntas de ejemplo
  questions = [
    {
      id: 1,
      questionText: 'What is your favorite color?',
      type: 'single',
      options: ['Red', 'Green', 'Blue']
    },
    {
      id: 2,
      questionText: 'Select your hobbies:',
      type: 'multiple',
      options: ['Reading', 'Gaming', 'Traveling']
    },
    {
      id: 3,
      questionText: 'Describe your experience:',
      type: 'open'
    }
  ];

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      answers: this.fb.array(this.questions.map((q) => this.createAnswerGroup(q)))
    });
  }

  // Crear grupo de respuestas según el tipo de pregunta
  createAnswerGroup(question: any): FormGroup {
    if (question.type === 'single') {
      return this.fb.group({
        questionId: [question.id],
        answer: ['', Validators.required] // Campo obligatorio
      });
    } else if (question.type === 'multiple') {
      return this.fb.group({
        questionId: [question.id],
        answers: this.fb.array([], Validators.required) // Respuesta múltiple obligatoria
      });
    } else if (question.type === 'open') {
      return this.fb.group({
        questionId: [question.id],
        answer: ['', Validators.required] // Campo obligatorio
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
    } else {
      this.form.markAllAsTouched();
      console.error('Formulario inválido');
    }
  }
}
