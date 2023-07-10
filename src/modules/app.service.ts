import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()
export class AppService {
  private _tokenName = 'erpToken';
  constructor(@Inject(CACHE_MANAGER) private cacheService: Cache) {}

  async cashe_test(): Promise<void> {
    await this.cacheService.set(this._tokenName, 'data.Token');
  }
  async getHello(): Promise<string> {
    await this.cashe_test();
    const p = await this.cacheService.get(this._tokenName);
    console.log(p);
    return 'Hello World1!';
  }
}
