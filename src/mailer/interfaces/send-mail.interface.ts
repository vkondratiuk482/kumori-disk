export interface ISendMail {
  readonly to: string;

  readonly subject: string;

  readonly text: string;
}
