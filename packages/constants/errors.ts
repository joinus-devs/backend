import { ErrorResponse as Err } from "../types";

const Errors = {
  BadRequest: new Err(400, 40000, "잘못된 요청입니다."),
  PasswordNotMatch: new Err(401, 40100, "비밀번호가 일치하지 않습니다."),
  InvalidToken: new Err(401, 40101, "유효하지 않은 토큰입니다."),
  NotAdmin: new Err(403, 40300, "클럽 어드민이 아닙니다."),
  NotStaff: new Err(403, 40301, "클럽 관리자가 아닙니다."),
  UserNotInClub: new Err(403, 40302, "클럽에 가입되지 않은 유저입니다."),
  UserNotMember: new Err(403, 40303, "클럽 멤버가 아닙니다."),
  TokenExpired: new Err(419, 41900, "토큰이 만료되었습니다."),
  UserNotFound: new Err(404, 40400, "유저를 찾을 수 없습니다."),
  ClubNotFound: new Err(404, 40401, "그룹을 찾을 수 없습니다."),
  CategoryNotFound: new Err(404, 40402, "카테고리를 찾을 수 없습니다."),
  FeedNotFound: new Err(404, 40403, "피드를 찾을 수 없습니다."),
  CommentNotFound: new Err(404, 40404, "댓글을 찾을 수 없습니다."),
  UserNotFoundInClub: new Err(404, 40405, "가입된 유저가 아닙니다."),
  ClubNameAlreadyExists: new Err(409, 40900, "이미 존재하는 그룹명입니다."),
  CategoryNameAlreadyExists: new Err(
    409,
    40901,
    "이미 존재하는 카테고리명입니다."
  ),
  UserAlreadyJoined: new Err(409, 40902, "이미 가입한 그룹입니다."),
  InternalServerError: new Err(
    500,
    50000,
    "서버 내부 오류입니다. 관리자에게 문의하세요."
  ),
};

export default Errors;
