package com.example.expensetracker.dto;

import com.example.expensetracker.model.Expense;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class GuestExpenseImportRequest {
    private Long userId;
    private List<Expense> expenses;
}
