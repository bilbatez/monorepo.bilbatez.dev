export class Interest {
  readonly type!: InterestType;
  readonly display!: InterestDisplay;
}

export class InterestDisplay {
  readonly name?: string;
  readonly description!: string;
  readonly formula?: string;
}

export enum InterestType {
  NONE,
  FLAT,
  EFFECTIVE,
  ANNUITY,
  FLOATING,
}

export type AvailableInterest = { [key in InterestType]: Interest }
