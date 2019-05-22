export default class BaseService {
  constructor(collection) {
    this.collection = collection;
  }

  insert(data) {
    return this.collection.create(data);
  }

  update(id, newDoc) {
    const updated = {
      $set: newDoc,
    };
    return this.collection.updateOne({ _id: id }, updated).exec();
  }

  delete(id) {
    return this.collection.updateOne({ _id: id }, { deleted: true }).exec();
  }

  get(id) {
    return this.collection
      .findOne({
        _id: id,
        $or: [
          { deleted: { $exists: false } },
          { deleted: { $exists: true, $in: [false] } },
        ],
      })
      .exec();
  }

  async getAll(condition, options) {
    const { skip = 0, limit, sort = { updatedAt: -1 } } = options;
    const notDeletedCondition = {
      $or: [
        { deleted: { $exists: false } },
        { deleted: { $exists: true, $in: [false] } },
      ],
    };
    const queryCondition = {
      $and: [condition, notDeletedCondition],
    };
    const totalRecord = await this.collection
      .find(queryCondition, null, options)
      .count();
    const result = await this.collection
      .find(queryCondition, null, options)
      .sort(sort)
      .skip(+skip)
      .limit(+limit || 0)
      .exec();
    return {
      result,
      totalRecord,
    };
  }
}
