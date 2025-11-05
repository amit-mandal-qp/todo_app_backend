import {Global, Module} from '@nestjs/common'
import {ResponseService} from './response/responseServic'

@Global()
@Module({
  imports: [],
  controllers: [],
  providers: [ResponseService],
  exports: [ResponseService],
})
export class InfraModule {}
