import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { UsuarioService } from './usuario.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { RecoveryPasswordDto } from './dto/recovery-password.dto';
import { ApiQuery } from '@nestjs/swagger';
import { ParseIntPipe } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiOkResponse } from '@nestjs/swagger';
import { GetUsuarioByRutDto } from './dto/get-usuario-by-rut.dto';

@Controller('usuario')
export class UsuarioController {
  constructor(private readonly usuarioService: UsuarioService) {}

  @Post()
  create(@Body() createUsuarioDto: CreateUsuarioDto) {
    return this.usuarioService.createUsuario(createUsuarioDto);
  }

  @Post('recovery-password')
  recoveryPassword(@Body() recoveryPasswordDto: RecoveryPasswordDto) {
    return this.usuarioService.recoveryPassword(recoveryPasswordDto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUsuarioDto: UpdateUsuarioDto) {
    return this.usuarioService.updateUsuario(+id, updateUsuarioDto);
  }

  @Get()
  @ApiQuery({
    name: 'idRol',
    required: false,
    description: 'ID of the role to filter users',
    type: Number,
  })
  findAll(@Query('idRol') idRol?: number) {
    return this.usuarioService.findUsers(idRol);
  }

  @Get(':rut')
  findOne(@Param('rut') rut: number) {
    return this.usuarioService.findUserByRut(rut);
  }

  @Get('rut/:rut')
  @ApiOperation({ summary: 'Obtener usuario por RUT' })
  @ApiParam({ name: 'rut', example: 11111111 })
  @ApiOkResponse({ type: GetUsuarioByRutDto })
  public async getUsuarioByRut(
    @Param('rut', ParseIntPipe) rut: number,
  ): Promise<GetUsuarioByRutDto> {
    return this.usuarioService.getUsuarioByRut(rut);
  }


}
