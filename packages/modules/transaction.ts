import { DataSource, EntityManager } from "typeorm";

class TransactionManager {
  private _datasource: DataSource;

  constructor(datasource: DataSource) {
    this._datasource = datasource;
  }

  withTransaction = async <T>(
    callback: (manager: EntityManager) => Promise<T>
  ) => {
    const queryRunner = this._datasource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const result = await callback(queryRunner.manager);
      await queryRunner.commitTransaction();
      return result;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  };
}

export default TransactionManager;
