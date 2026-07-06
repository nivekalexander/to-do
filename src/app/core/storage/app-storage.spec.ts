import { TestBed } from '@angular/core/testing';
import { Storage } from '@ionic/storage-angular';

import { AppStorage } from './app-storage';

describe('AppStorage', () => {
  let service: AppStorage;
  let storageMock: jasmine.SpyObj<Storage>;

  beforeEach(() => {
    storageMock = jasmine.createSpyObj<Storage>('Storage', [
      'create',
      'get',
      'set',
      'remove',
    ]);

    storageMock.create.and.resolveTo(storageMock);
    storageMock.get.and.resolveTo(null);
    storageMock.set.and.returnValue(Promise.resolve());
    storageMock.remove.and.returnValue(Promise.resolve());

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

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return the default value when the key does not exist', async () => {
    storageMock.get.and.resolveTo(null);

    const result = await service.get('tasks', []);

    expect(result).toEqual([]);
    expect(storageMock.get).toHaveBeenCalledWith('tasks');
  });

  it('should store a value', async () => {
    await service.set('tasks', ['Task 1']);

    expect(storageMock.set).toHaveBeenCalledWith(
      'tasks',
      ['Task 1'],
    );
  });

  it('should remove a value', async () => {
    await service.remove('tasks');

    expect(storageMock.remove).toHaveBeenCalledWith('tasks');
  });

  it('should initialize Ionic Storage only once', async () => {
    await service.get('tasks', []);
    await service.get('categories', []);

    expect(storageMock.create).toHaveBeenCalledTimes(1);
  });
});