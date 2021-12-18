import {MigrationInterface, QueryRunner} from "typeorm";

export class todo1639850286263 implements MigrationInterface {
    name = 'todo1639850286263'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "todo" ("id" character varying NOT NULL, "title" character varying NOT NULL, "userId" character varying NOT NULL, "tasks" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT '"2021-12-18T17:58:08.028Z"', "updated_at" TIMESTAMP NOT NULL DEFAULT '"2021-12-18T17:58:08.028Z"', CONSTRAINT "PK_d429b7114371f6a35c5cb4776a7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "notation" ALTER COLUMN "updated_at" SET DEFAULT '"2021-12-18T17:58:07.994Z"'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "notation" ALTER COLUMN "updated_at" SET DEFAULT '2021-10-31 13:58:37.779'`);
        await queryRunner.query(`DROP TABLE "todo"`);
    }

}
