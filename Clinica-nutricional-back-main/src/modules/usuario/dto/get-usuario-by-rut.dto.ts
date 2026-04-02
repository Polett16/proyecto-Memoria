import { ApiProperty } from '@nestjs/swagger';

export class GetUsuarioByRutDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 11111111 })
  rut: number;

  @ApiProperty({ example: 'Juan Pérez' })
  nombre: string;

  @ApiProperty({ example: '1990-01-01' })
  fechaNacimiento: Date;

  @ApiProperty({ example: 987654321 })
  telefono: number;

  @ApiProperty({ example: 'correo@email.com' })
  correo: string;

  @ApiProperty({ example: 'M' })
  sexo: string;
}