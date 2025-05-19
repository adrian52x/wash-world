import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { AppModule } from '../../src/app.module';


@Module({
    imports: [AppModule],
})
export class TestAppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) { }
}
