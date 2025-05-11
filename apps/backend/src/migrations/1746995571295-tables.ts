import { MigrationInterface, QueryRunner } from "typeorm";

export class Tables1746995571295 implements MigrationInterface {
    name = 'Tables1746995571295'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "wash_types" ("wash_type_id" SERIAL NOT NULL, "name" character varying NOT NULL, "description" character varying NOT NULL, "price" integer NOT NULL, "is_auto_wash" boolean NOT NULL, CONSTRAINT "PK_f023b0697a4dccc5292ddc48e4d" PRIMARY KEY ("wash_type_id"))`);
        await queryRunner.query(`CREATE TABLE "locations" ("location_id" SERIAL NOT NULL, "address" character varying NOT NULL, CONSTRAINT "PK_582bb9b1865f02814bd7c2c9650" PRIMARY KEY ("location_id"))`);
        await queryRunner.query(`CREATE TABLE "washes" ("wash_id" SERIAL NOT NULL, "date_time" TIMESTAMP NOT NULL, "wash_type_id" integer, "location_id" integer, CONSTRAINT "PK_ab742d1b5d3707f82d16718d84e" PRIMARY KEY ("wash_id"))`);
        await queryRunner.query(`CREATE TYPE "public"."users_role_enum" AS ENUM('REGULAR_USER', 'GOLD_USER', 'PREMIUM_USER', 'BRILLIANT_USER')`);
        await queryRunner.query(`CREATE TABLE "users" ("user_id" SERIAL NOT NULL, "username" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "address" character varying NOT NULL, "phone_number" character varying NOT NULL, "license_plate" character varying NOT NULL, "role" "public"."users_role_enum" NOT NULL DEFAULT 'REGULAR_USER', CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_96aac72f1574b88752e9fb00089" PRIMARY KEY ("user_id"))`);
        await queryRunner.query(`CREATE TABLE "memberships" ("membership_id" SERIAL NOT NULL, "price" integer NOT NULL, "wash_type_id" integer, CONSTRAINT "REL_96e8ab4733302b3621fad138f7" UNIQUE ("wash_type_id"), CONSTRAINT "PK_7a384cb49f51572dda94f5b281c" PRIMARY KEY ("membership_id"))`);
        await queryRunner.query(`ALTER TABLE "washes" ADD CONSTRAINT "FK_de0c32ea7b1eb3d6e08b11f806e" FOREIGN KEY ("wash_type_id") REFERENCES "wash_types"("wash_type_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "washes" ADD CONSTRAINT "FK_2defb121999f05d045853870cc5" FOREIGN KEY ("location_id") REFERENCES "locations"("location_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "memberships" ADD CONSTRAINT "FK_96e8ab4733302b3621fad138f70" FOREIGN KEY ("wash_type_id") REFERENCES "wash_types"("wash_type_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "memberships" DROP CONSTRAINT "FK_96e8ab4733302b3621fad138f70"`);
        await queryRunner.query(`ALTER TABLE "washes" DROP CONSTRAINT "FK_2defb121999f05d045853870cc5"`);
        await queryRunner.query(`ALTER TABLE "washes" DROP CONSTRAINT "FK_de0c32ea7b1eb3d6e08b11f806e"`);
        await queryRunner.query(`DROP TABLE "memberships"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TYPE "public"."users_role_enum"`);
        await queryRunner.query(`DROP TABLE "washes"`);
        await queryRunner.query(`DROP TABLE "locations"`);
        await queryRunner.query(`DROP TABLE "wash_types"`);
    }

}
