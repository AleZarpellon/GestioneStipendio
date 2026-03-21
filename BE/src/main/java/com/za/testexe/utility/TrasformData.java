package com.za.testexe.utility;

import java.math.BigDecimal;
import java.math.RoundingMode;

public class TrasformData {
    public static BigDecimal scale(BigDecimal value) {
        if (value == null) {
            return null;
        }
        return value.setScale(2, RoundingMode.HALF_UP);
    }
}
