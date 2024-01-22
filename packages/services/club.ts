import {
  ClubConverter,
  ClubCreate,
  ClubDto,
  ClubUpdate,
  ClubWithUsersDto,
} from "../models";
import { UserInClub } from "../models/userInClub";
import { TransactionManager } from "../modules";
import { IUserRepository } from "../repositories";
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
  private _transactionManager: TransactionManager;
  private _clubRepository: IClubRepository;
  private _userRepository: IUserRepository;

  private constructor(
    transactionManager: TransactionManager,
    clubRepository: IClubRepository,
    userRepository: IUserRepository
  ) {
    this._transactionManager = transactionManager;
    this._clubRepository = clubRepository;
    this._userRepository = userRepository;
  }

  static getInstance(
    transactionManager: TransactionManager,
    clubRepository: IClubRepository,
    userRepository: IUserRepository
  ) {
    if (!this._instance) {
      this._instance = new ClubService(
        transactionManager,
        clubRepository,
        userRepository
      );
    }

    return this._instance;
  }

  find = async (id: number) => {
    let club;
    try {
      club = await this._clubRepository.find(id);
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
      club = await this._clubRepository.findWithUsers(id);
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
      const clubs = await this._clubRepository.findAll();
      return clubs.map((club) => ClubConverter.toDto(club));
    } catch (err) {
      throw new ErrorResponse(500, "Internal Server Error");
    }
  };

  create = async (clubCreate: ClubCreate) => {
    try {
      return this._transactionManager.withTransaction(async () => {
        const user = await this._userRepository.findWithClubs(clubCreate.user);
        if (!user) {
          throw new ErrorResponse(404, "User not found");
        }
        const club = ClubConverter.toEntityFromCreate(clubCreate);
        const userInClub = new UserInClub();
        userInClub.user = user;
        userInClub.club = club;
        club.users = [userInClub];
        return await this._clubRepository.create(club);
      });
    } catch (err) {
      if (err instanceof ErrorResponse) {
        throw err;
      }
      throw new ErrorResponse(500, "Internal Server Error");
    }
  };

  update = async (id: number, clubUpdate: ClubUpdate) => {
    try {
      return await this._clubRepository.update(
        ClubConverter.toEntityFromUpdate(id, clubUpdate)
      );
    } catch (err) {
      throw new ErrorResponse(500, "Internal Server Error");
    }
  };

  delete = async (id: number) => {
    try {
      return await this._clubRepository.delete(id);
    } catch (err) {
      throw new ErrorResponse(500, "Internal Server Error");
    }
  };
}
