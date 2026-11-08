package com.example.expensetracker.controller;

import com.example.expensetracker.dto.GuestExpenseImportRequest;
import com.example.expensetracker.dto.GuestExpenseImportResult;
import com.example.expensetracker.model.Expense;
import com.example.expensetracker.service.ExpenseService;
import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/expenses")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ExpenseController {

    private final ExpenseService expenseService;

    // GET all expenses for a user
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Expense>> getAllExpenses(@PathVariable Long userId) {
        return ResponseEntity.ok(expenseService.getExpensesByUserId(userId));
    }

    // GET single expense by ID (with optional userId ownership check)
    @GetMapping("/{id}")
    public ResponseEntity<Expense> getExpense(@PathVariable Long id,
                                              @RequestParam(required = false) Long userId) {
        return ResponseEntity.ok(expenseService.getExpenseByIdAndUserId(id, userId));
    }

    // POST create new expense
    @PostMapping
    public ResponseEntity<Expense> createExpense(@RequestBody Expense expense) {
        return ResponseEntity.status(HttpStatus.CREATED)
                             .body(expenseService.createExpense(expense));
    }

    // PUT update expense (with optional userId ownership check)
    @PutMapping("/{id}")
    public ResponseEntity<Expense> updateExpense(@PathVariable Long id,
                                                 @RequestParam(required = false) Long userId,
                                                 @RequestBody Expense expense) {
        Long targetUserId = userId;
        if (targetUserId == null && expense.getUser() != null) {
            targetUserId = expense.getUser().getId();
        }
        return ResponseEntity.ok(expenseService.updateExpense(id, targetUserId, expense));
    }

    // DELETE expense (with optional userId ownership check)
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteExpense(@PathVariable Long id,
                                                @RequestParam(required = false) Long userId) {
        expenseService.deleteExpense(id, userId);
        return ResponseEntity.ok("Expense deleted successfully");
    }

    // POST import guest expenses (idempotent duplicate prevention)
    @PostMapping("/import")
    public ResponseEntity<GuestExpenseImportResult> importExpenses(
            @RequestParam(required = false) Long userId,
            @RequestBody GuestExpenseImportRequest request) {
        Long targetUserId = userId != null ? userId : (request != null ? request.getUserId() : null);
        if (targetUserId == null) {
            return ResponseEntity.badRequest().build();
        }
        GuestExpenseImportResult result = expenseService.importGuestExpenses(
                targetUserId, 
                request != null ? request.getExpenses() : null
        );
        return ResponseEntity.ok(result);
    }

    // GET monthly total
    @GetMapping("/total")
    public ResponseEntity<Double> getMonthlyTotal(@RequestParam Long userId,
                                                   @RequestParam int month,
                                                   @RequestParam int year) {
        return ResponseEntity.ok(expenseService.getMonthlyTotal(userId, month, year));
    }

    // GET by category
    @GetMapping("/category")
    public ResponseEntity<List<Expense>> getByCategory(@RequestParam Long userId,
                                                        @RequestParam String category) {
        return ResponseEntity.ok(expenseService.getByCategory(userId, category));
    }
}