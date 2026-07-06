import { TestBed } from '@angular/core/testing';
import {
  Storage,
} from '@ionic/storage-angular';

import { AppStorage } from './app-storage';

describe('AppStorage', () => {
  let service: AppStorage;
  let storageMock:
    jasmine.SpyObj<Storage>;

  beforeEach(() => {
    storageMock =
      jasmine.createSpyObj<Storage>(
        'Storage',
        [
          'create',
          'get',
          'set',
          'remove',
        ],
      );

    storageMock.create.and.resolveTo(
      storageMock,
    );

    storageMock.get.and.resolveTo(null);

    storageMock.set.and.returnValue(
      Promise.resolve(),
    );

    storageMock.remove.and.returnValue(
      Promise.resolve(),
    );

    TestBed.configureTestingModule({
      providers: [
        AppStorage,
        {
          provide: Storage,
          useValue: storageMock,
        },
      ],
    });

    service = TestBed.inject(AppStorage);
  });

  it('devuelve el valor por defecto si no existe', async () => {
    const result = await service.get(
      'tasks',
      [],
    );

    expect(result).toEqual([]);
  });

  it('guarda un valor', async () => {
    await service.set(
      'tasks',
      ['Tarea'],
    );

    expect(storageMock.set)
      .toHaveBeenCalledWith(
        'tasks',
        ['Tarea'],
      );
  });

  it('elimina un valor', async () => {
    await service.remove('tasks');

    expect(storageMock.remove)
      .toHaveBeenCalledWith('tasks');
  });

  it('inicializa el almacenamiento una sola vez', async () => {
    await service.get('tasks', []);
    await service.get('categories', []);

    expect(storageMock.create)
      .toHaveBeenCalledTimes(1);
  });
});
