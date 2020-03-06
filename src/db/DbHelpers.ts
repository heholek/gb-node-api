import { Model } from "mongoose";

export default class DbHelpers {
  private _model: Model<any>;

  get model() {
    return this._model;
  }

  constructor(dbModel: Model<any>) {
    this._model = dbModel;
  }

  public createOne(object: any): Promise<any> {
    const newData = new this.model(object);
    return newData.save();
  }

  public getCount() {
    return this._model.countDocuments();
  }

  public findById(id: string) {
    return this._model.findOne({ _id: id }).exec();
  }

  public add(item: any) {
    return this._model.insertMany(item);
  }

  public edit(id: string, item: any) {
    return this._model.findOneAndUpdate({ _id: id }, item, { upsert: true });
  }

  public delete(id: string) {
    return this._model.deleteOne({ _id: id });
  }

  public getAll(): any {
    return this._model.find({}).exec();
  }
}
