import { IsArray, IsDateString, IsOptional, IsString } from 'class-validator';

export class CreateSprintDto {
  @IsString()
  title!: string;

  @IsDateString()
  startDate!: Date;

  @IsDateString()
  endDate!: Date;

  @IsString()
  goals!: string;

  @IsString()
  pid!: string;
}

export class CreateSprintTaskDto {
  @IsString()
  uid!: string;

  @IsDateString()
  startDate!: Date;

  @IsDateString()
  dueDate!: Date;

  @IsString()
  status!: string;

  @IsString()
  title!: string;

  @IsString()
  description!: string;
}

export class UpdateSprintTaskDto {
  @IsOptional()
  @IsString()
  uid!: string;

  @IsOptional()
  @IsDateString()
  startDate!: Date;

  @IsOptional()
  @IsDateString()
  dueDate!: Date;

  @IsOptional()
  @IsString()
  status!: string;

  @IsOptional()
  @IsString()
  title!: string;

  @IsOptional()
  @IsString()
  description!: string;
}

export class EndSprintDto {
  @IsArray()
  tasks!: string[]

  @IsString()
  @IsOptional()
  note!: string

  @IsString()
  sid!: string
}

export class CreateCommentDto {
  @IsString()
  text!: string;

  @IsString()
  sid!: string;

  @IsString()
  uid!: string;
}
