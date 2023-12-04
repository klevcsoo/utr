package hu.bathorydse.utrapi.support;

import hu.bathorydse.utrapi.core.ConsoleOutputStream;
import java.util.Map;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@CrossOrigin(origins = {"http://localhost:3000", "https://utr.hu"}, maxAge = 43200)
@RestController
@RequestMapping("/api/support")
@PreAuthorize("hasRole('ADMIN')")
public class SupportController {

    @GetMapping("/env")
    public ResponseEntity<Map<String, String>> getEnvironmentVariables() {
        return ResponseEntity.ok(System.getenv());
    }

    @GetMapping("/log")
    public ResponseEntity<String[]> getServerLog() {
        String rawOutput = ConsoleOutputStream.getInstance().getConsoleOutput();
        String[] lines = rawOutput.split("\n");

        for (int i = 0; i < lines.length; i++) {
            lines[i] = lines[i]
                .replaceAll("\\[(0;)?[0-9]*m", "")
                .replaceAll("\\u001b", "");
        }

        return ResponseEntity.ok(lines);
    }
}
