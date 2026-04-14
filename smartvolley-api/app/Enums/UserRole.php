<?php

namespace App\Enums;

enum UserRole: string
{
  case ADMIN = 'admin';
  case COACH = 'coach';
  case PARENT = 'parent';

  public function getLabel(): string
  {
    return match ($this) {
      UserRole::ADMIN => 'Admin',
      UserRole::COACH => 'Trener',
      UserRole::PARENT => 'Roditelj',
    };
  }

  public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}
