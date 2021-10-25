import {MigrationInterface, QueryRunner} from "typeorm";

export class migrationname1635138763956 implements MigrationInterface {
    name = 'migrationname1635138763956'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "valid_sign" TIMESTAMP`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "valid_sign"`);
    }

}
