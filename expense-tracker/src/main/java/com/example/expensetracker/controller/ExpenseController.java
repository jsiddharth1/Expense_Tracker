package com.example.expensetracker.controller;

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

    // GET single expense by ID
    @GetMapping("/{id}")
    public ResponseEntity<Expense> getExpense(@PathVariable Long id) {
        return ResponseEntity.ok(expenseService.getExpenseById(id));
    }

    // POST create new expense
    @PostMapping
    public ResponseEntity<Expense> createExpense(@RequestBody Expense expense) {
        return ResponseEntity.status(HttpStatus.CREATED)
                             .body(expenseService.createExpense(expense));
    }

    // PUT update expense
    @PutMapping("/{id}")
    public ResponseEntity<Expense> updateExpense(@PathVariable Long id,
                                                  @RequestBody Expense expense) {
        return ResponseEntity.ok(expenseService.updateExpense(id, expense));
    }

    // DELETE expense
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteExpense(@PathVariable Long id) {
        expenseService.deleteExpense(id);
        return ResponseEntity.ok("Expense deleted successfully");
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