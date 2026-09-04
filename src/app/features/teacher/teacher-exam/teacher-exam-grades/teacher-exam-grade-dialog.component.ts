import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-teacher-exam-grade-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule, MatButtonModule, MatCheckboxModule, MatDialogModule, MatFormFieldModule, MatInputModule],
  templateUrl: './teacher-exam-grade-dialog.component.html',
  styleUrl: './teacher-exam-grade-dialog.component.css',
})
export class TeacherExamGradeDialogComponent {
  evaluations: Record<string, boolean> = {};
  feedback = '';

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { exam: any; result: any },
    private dialogRef: MatDialogRef<TeacherExamGradeDialogComponent>,
  ) {
    this.feedback = data.result.submission.feedback ?? '';
    data.result.submission.answers.forEach((answer: any) => {
      const question = this.questionFor(answer.questionId);
      this.evaluations[answer.questionId] = this.isAutomatic(question)
        ? this.isAnswerCorrect(question, answer)
        : answer.isCorrect === true;
    });
  }

  questionFor(questionId: string | number): any {
    return this.data.exam.questions.find((question: any) => String(question.id) === String(questionId));
  }

  isAutomatic(question: any): boolean {
    return question?.type === 'single' || question?.type === 'multiple';
  }

  answerFor(questionId: string | number): any {
    return this.data.result.submission.answers.find((answer: any) => String(answer.questionId) === String(questionId));
  }

  formatAnswer(questionId: string | number): string {
    const answer = this.answerFor(questionId);
    if (!answer) return 'Sin respuesta';
    return Array.isArray(answer.answers) ? answer.answers.join(', ') : answer.answer;
  }

  save(): void {
    const answers = this.data.result.submission.answers.map((answer: any) => ({
      questionId: answer.questionId,
      isCorrect: this.evaluations[answer.questionId] === true,
    }));
    this.dialogRef.close({ answers, feedback: this.feedback });
  }

  private isAnswerCorrect(question: any, answer: any): boolean {
    if (question.type === 'single') return answer.answer === question.correctAnswers;
    const submitted = Array.isArray(answer.answers) ? [...answer.answers].map(String).sort() : [];
    const expected = Array.isArray(question.correctAnswers) ? [...question.correctAnswers].map(String).sort() : [];
    return submitted.length === expected.length && submitted.every((value, index) => value === expected[index]);
  }
}
