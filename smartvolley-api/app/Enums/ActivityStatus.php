<?php

namespace App\Enums;

enum ActivityStatus: string
{
  case SCHEDULED = 'scheduled';
  case CANCELED = 'canceled';
  case POSTPONED = 'postponed';
  case COMPLETED = 'completed';

  public function getLabel(): string
  {
    return match ($this) {
      ActivityStatus::SCHEDULED => 'Zakazan/a',
      ActivityStatus::CANCELED => 'Otkazan/a',
      ActivityStatus::POSTPONED => 'Odlozen/a',
      ActivityStatus::COMPLETED => 'Zavrsen/a',
    };
  }

  public static function values(): array
  {
    return array_column(self::cases(), 'value');
  }
}
