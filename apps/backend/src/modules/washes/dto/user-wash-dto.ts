import { LocationDTO } from 'src/modules/locations/dto/location.dto';
import { WashTypeEnum } from 'src/utils/enums';
import { WashTypeDTO } from './wash-type.dto';

export class UserWashDTO {
  washId: number;
  createdAt: Date;
  location: LocationDTO;
  washType: WashTypeDTO;
  amountPaid: number;
}
