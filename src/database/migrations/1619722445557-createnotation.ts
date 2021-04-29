import {MigrationInterface, QueryRunner} from "typeorm";

export class createnotation1619722445557 implements MigrationInterface {
    name = 'createnotation1619722445557'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "notation" ("id" varchar PRIMARY KEY NOT NULL, "title" varchar NOT NULL, "body" varchar NOT NULL, "user_id" varchar NOT NULL, "created_at" datetime NOT NULL DEFAULT (datetime('now')))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "notation"`);
    }

}
