package com.example.expensetracker.service;

import com.example.expensetracker.model.Expense;
import com.example.expensetracker.repository.ExpenseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ExpenseService {

    private final ExpenseRepository expenseRepository;

    public Expense createExpense(Expense expense) {
        return expenseRepository.save(expense);
    }

    public Expense addExpense(Expense expense) {
        return expenseRepository.save(expense);
    }

    public Expense getExpenseById(Long id) {
        return expenseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Expense not found with id: " + id));
    }

    public List<Expense> getAllExpenses() {
        return expenseRepository.findAll();
    }

    public List<Expense> getExpensesByUserId(Long userId) {
        return expenseRepository.findByUserId(userId);
    }

    public List<Expense> getByCategory(Long userId, String category) {
        return expenseRepository.findByUserIdAndCategory(userId, category);
    }

    public Double getMonthlyTotal(Long userId, int month, int year) {
        return expenseRepository.findByUserId(userId)
                .stream()
                .filter(e -> e.getDate() != null
                           && e.getDate().getMonthValue() == month
                           && e.getDate().getYear() == year)
                .mapToDouble(e -> e.getAmount() != null ? e.getAmount() : 0.0)
                .sum();
    }

    public Double getAverageExpense(Long userId) {
        return expenseRepository.findByUserId(userId)
                .stream()
                .filter(e -> e.getAmount() != null)
                .mapToDouble(Expense::getAmount)
                .average()
                .orElse(0.0);
    }

    public Expense updateExpense(Long id, Expense updatedExpense) {
        Expense existing = getExpenseById(id);
        existing.setTitle(updatedExpense.getTitle());
        existing.setAmount(updatedExpense.getAmount());
        existing.setCategory(updatedExpense.getCategory());
        existing.setDescription(updatedExpense.getDescription());
        existing.setDate(updatedExpense.getDate());
        return expenseRepository.save(existing);
    }

    public void deleteExpense(Long id) {
        expenseRepository.deleteById(id);
    }
}