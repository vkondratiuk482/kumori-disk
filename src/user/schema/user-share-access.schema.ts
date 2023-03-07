import { Field, InputType } from '@nestjs/graphql';
import { IsArray, IsEnum, IsString, IsUUID } from 'class-validator';
import { FileConsumer } from 'src/file/enums/file-consumer.enum';

@InputType()
export class UserShareAccessSchema {
  @IsUUID()
  @Field()
  public readonly tenantId: string;

  @IsEnum(FileConsumer)
  @Field()
  public readonly tenantType: FileConsumer;

  @IsArray()
  @IsString({ each: true })
  @Field(() => [String])
  public readonly fileIds: string[];
}
