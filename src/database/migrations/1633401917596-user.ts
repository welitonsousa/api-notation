import {MigrationInterface, QueryRunner} from "typeorm";

export class user1633401917596 implements MigrationInterface {
    name = 'user1633401917596'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "picture" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "picture"`);
    }

}
