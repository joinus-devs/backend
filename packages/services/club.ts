import {
  ClubConverter,
  ClubCreate,
  ClubDto,
  ClubUpdate,
  ClubWithUsersDto,
} from "../models";
import { IClubRepository } from "../repositories/club";
import { ErrorResponse, Nullable } from "../types";

export interface IClubService {
  find(id: number): Promise<Nullable<ClubDto>>;
  findWithUsers(id: number): Promise<Nullable<ClubWithUsersDto>>;
  findAll(): Promise<ClubDto[]>;
  create(clubCreate: ClubCreate): Promise<number>;
  update(id: number, clubUpdate: ClubUpdate): Promise<number>;
  delete(id: number): Promise<number>;
}

export class ClubService implements IClubService {
  private static _instance: Nullable<ClubService> = null;
  private _repository: IClubRepository;

  private constructor(repository: IClubRepository) {
    this._repository = repository;
  }

  static getInstance(repository: IClubRepository) {
    if (!this._instance) {
      this._instance = new ClubService(repository);
    }

    return this._instance;
  }

  find = async (id: number) => {
    let club;
    try {
      club = await this._repository.find(id);
    } catch (err) {
      throw new ErrorResponse(500, "Internal Server Error");
    }
    if (!club) {
      throw new ErrorResponse(404, "Club not found");
    }
    return ClubConverter.toDto(club);
  };

  findWithUsers = async (id: number) => {
    let club;
    try {
      club = await this._repository.findWithUsers(id);
    } catch (err) {
      throw new ErrorResponse(500, "Internal Server Error");
    }
    if (!club) {
      throw new ErrorResponse(404, "Club not found");
    }
    return ClubConverter.toDtoWithUsers(club);
  };

  findAll = async () => {
    try {
      const clubs = await this._repository.findAll();
      return clubs.map((club) => ClubConverter.toDto(club));
    } catch (err) {
      throw new ErrorResponse(500, "Internal Server Error");
    }
  };

  create = async (clubCreate: ClubCreate) => {
    try {
      return await this._repository.create(
        ClubConverter.toEntityFromCreate(clubCreate)
      );
    } catch (err) {
      if (err instanceof ErrorResponse) {
        throw err;
      }
      throw new ErrorResponse(500, "Internal Server Error");
    }
  };

  update = async (id: number, clubUpdate: ClubUpdate) => {
    try {
      return await this._repository.update(
        ClubConverter.toEntityFromUpdate(id, clubUpdate)
      );
    } catch (err) {
      throw new ErrorResponse(500, "Internal Server Error");
    }
  };

  delete = async (id: number) => {
    try {
      return await this._repository.delete(id);
    } catch (err) {
      throw new ErrorResponse(500, "Internal Server Error");
    }
  };
}
