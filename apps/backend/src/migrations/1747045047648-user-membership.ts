import { MigrationInterface, QueryRunner } from "typeorm";

export class UserMembership1747045047648 implements MigrationInterface {
    name = 'UserMembership1747045047648'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user_memberships" ("user_membership_id" SERIAL NOT NULL, "start_date" date NOT NULL, "end_date" date, "user_id" integer, "membership_id" integer, CONSTRAINT "REL_b369bfb0586d848e7f52f47d49" UNIQUE ("user_id"), CONSTRAINT "PK_b900c37e7b2c36561123f22ebdc" PRIMARY KEY ("user_membership_id"))`);
        await queryRunner.query(`ALTER TABLE "user_memberships" ADD CONSTRAINT "FK_b369bfb0586d848e7f52f47d492" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_memberships" ADD CONSTRAINT "FK_12bfa040225db30fd3530569b5c" FOREIGN KEY ("membership_id") REFERENCES "memberships"("membership_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_memberships" DROP CONSTRAINT "FK_12bfa040225db30fd3530569b5c"`);
        await queryRunner.query(`ALTER TABLE "user_memberships" DROP CONSTRAINT "FK_b369bfb0586d848e7f52f47d492"`);
        await queryRunner.query(`DROP TABLE "user_memberships"`);
    }

}
