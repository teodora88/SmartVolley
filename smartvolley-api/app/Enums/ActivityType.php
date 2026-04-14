<?php

namespace App\Enums;

enum ActivityType: string
{
    case PRACTICE = 'practice';
    case GAME = 'game';
    case TOURNAMENT = 'tournament';

    public function getLabel(): string
    {
        return match ($this) {
          ActivityType::PRACTICE => 'Trening',
          ActivityType::GAME => 'Utakmica',
          ActivityType::TOURNAMENT => 'Turnir',
        };
    }

    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}
