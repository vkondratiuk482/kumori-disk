export interface SendMail {
  readonly to: string;

  readonly subject: string;

  readonly text: string;
}
