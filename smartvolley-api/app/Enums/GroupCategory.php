<?php

namespace App\Enums;

enum GroupCategory: string
{
    case SKOLICA = 'Skolica';
    case PIONIRKE  = 'Pionirke';
    case KADETKINJE = 'Kadetkinje';
    case JUNIORKE = 'Juniorke';


    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}
