import {MigrationInterface, QueryRunner} from "typeorm";

export class migrationname1634747604714 implements MigrationInterface {
    name = 'migrationname1634747604714'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "hashs" ("id" character varying NOT NULL, "email" character varying NOT NULL, "hash" character varying NOT NULL, "valid" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_1f21b655ec0f9cd59d30688fef0" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "hashs"`);
    }

}
