import { WashTypeEnum } from "src/utils/enums";

export class WashTypeDTO {
  washTypeId: number;
  type: WashTypeEnum;
  description: string;
  price: number;
  isAutoWash: boolean;
}