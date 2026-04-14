<?php

namespace App\Enums;

enum GroupCategory: string
{
    case SCHOOL = 'school';
    case PIONEERS = 'pioneers';
    case CADETS = 'cadets';
    case JUNIORS = 'juniors';

    public function getLabel(): string
    {
        return match ($this) {
            GroupCategory::SCHOOL => 'Školica',
            GroupCategory::PIONEERS => 'Pionirke',
            GroupCategory::CADETS => 'Kadetkinje',
            GroupCategory::JUNIORS => 'Juniorke',
        };
    }

    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}
