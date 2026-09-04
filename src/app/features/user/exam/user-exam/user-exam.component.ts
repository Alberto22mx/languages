import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
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
import { AlertsService } from '../../../../core/services/alerts/alerts.service';

@Component({
    selector: 'app-user-exam',
    imports: [CommonModule, ReactiveFormsModule, MatRadioModule, MatInputModule, MatCheckboxModule, MatButtonModule, MatIconModule, MatCardModule],
    templateUrl: './user-exam.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    styleUrl: './user-exam.component.css'
})
export class UserExamComponent implements OnInit {
  form!: FormGroup;
  questions?: any[] = [];
  currentIndex = 0;

  constructor(
    private fb: FormBuilder,
    private examsService: ExamsService,
    private authService: AuthService,
    private progressService: ProgressService,
    private alertsService: AlertsService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const userId = this.authService.getUserId();
    const userType = this.authService.getUserType();
    const examId = history.state.id;

    this.form = this.fb.group({
      userId: [userId],
      type: ['exam'],
      referenceId: [examId],
      answers: this.fb.array([]),
    });

    this.examsService.findOne(examId).subscribe((res) => {
      this.questions = res.questions;
      if (this.questions) {
        const answersArray = this.questions.map((q) => this.createAnswerGroup(q));
        this.form.setControl('answers', this.fb.array(answersArray));
      }
    });
  }

  createAnswerGroup(question: any): FormGroup {
    if (question.type === 'single' || question.type === 'open') {
      return this.fb.group({
        questionId: [question.id],
        answer: ['', Validators.required],
      });
    } else if (question.type === 'multiple') {
      return this.fb.group({
        questionId: [question.id],
        answers: this.fb.array([], Validators.required),
      });
    }
    throw new Error('Unknown question type');
  }

  get answers(): FormArray {
    return this.form.get('answers') as FormArray;
  }

  getAnswerFormGroup(index: number): FormGroup {
    return this.answers.at(index) as FormGroup;
  }

  onCheckboxChange(event: any, index: number): void {
    const answersControl = this.answers.at(index).get('answers') as FormArray;
    const value = event.source.value;

    if (event.checked) {
      if (!answersControl.value.includes(value)) {
        answersControl.push(this.fb.control(value));
      }
    } else {
      const i = answersControl.controls.findIndex((ctrl) => ctrl.value === value);
      if (i !== -1) {
        answersControl.removeAt(i);
      }
    }
  }

  onSubmit(): void {
    if (this.form.valid) {
      console.log('Formulario enviado:', this.form.value);
      this.progressService.createProgress(this.form.value).subscribe({
        next: () => this.router.navigate(['/modulos/i/exam']),
        error: (error) => this.alertsService.warning(error.error?.message ?? 'No fue posible enviar el examen.'),
      });
    } else {
      this.form.markAllAsTouched();
      console.error('Formulario inválido');
    }
  }

  goBack(): void {
    this.router.navigate(['/modulos/i/exam']);
  }

  get currentQuestion() {
    return this.questions![this.currentIndex];
  }

  nextQuestion(): void {
    if (this.currentIndex < this.questions!.length - 1) {
      this.currentIndex++;
    }
  }

  prevQuestion(): void {
    if (this.currentIndex > 0) {
      this.currentIndex--;
    }
  }

  getOptionLetter(index: number): string {
    return String.fromCharCode(65 + index);
  }
}
