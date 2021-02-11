import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Repository } from 'typeorm';
import { TMS } from '../../../entities';

@Injectable()
export class TMSService extends TypeOrmCrudService<TMS> {
  // injecting reposity as typeOrm Crud service need such architecure
  // to make all CRUDs
  constructor(@InjectRepository(TMS) public repo: Repository<TMS>) {
    super(repo);
  }
}
