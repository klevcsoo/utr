package hu.bathorydse.utrserver.core;

import java.time.LocalDate;
import java.time.ZoneId;
import java.util.Date;

public class ControllerUtils {

    public static Date createDate(String dateString) {
        LocalDate localDate = LocalDate.parse(dateString);
        ZoneId zoneId = ZoneId.systemDefault();
        return Date.from(localDate.atStartOfDay(zoneId).toInstant());
    }
}
