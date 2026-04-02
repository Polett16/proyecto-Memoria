import { Type } from 'class-transformer';

export class RolResponseDto {
  id: number;
  nombre: string;
}

export class GetRolesUsuarioDto {
  @Type(() => RolResponseDto)
  roles: RolResponseDto[];
}