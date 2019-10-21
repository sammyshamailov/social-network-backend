import mongoose from 'mongoose';

export class MongoConnection {
  private client: mongoose.Mongoose | undefined;
  private initialized = false;

  constructor(
    public readonly url: string,
  ) {}

  /**
   * Connects to mongo server
   */
  public async connect(): Promise<void> {
    this.client = await mongoose.connect(
      this.url,
      { useNewUrlParser: true,
        useUnifiedTopology: true 
      });
    this.initialized = true;
  }

  /**
   * Closes connection with mongo server
   * @returns close 
   */
  public async close(): Promise<void> {
    if (!this.initialized) return;
    await this.client!.disconnect();
    this.initialized = false;
  }
}
