package com.example.expensetracker.dto;

import com.example.expensetracker.model.Expense;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GuestExpenseImportResult {
    private int created;
    private int alreadyImported;
    private int rejected;
    private List<Expense> createdExpenses;
    private List<String> alreadyImportedClientIds;
    private List<String> rejectedReasons;
}
