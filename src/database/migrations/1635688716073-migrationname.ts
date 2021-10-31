import {MigrationInterface, QueryRunner} from "typeorm";

export class migrationname1635688716073 implements MigrationInterface {
    name = 'migrationname1635688716073'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "notation" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT '"2021-10-31T13:58:37.779Z"'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "notation" DROP COLUMN "updated_at"`);
    }

}
