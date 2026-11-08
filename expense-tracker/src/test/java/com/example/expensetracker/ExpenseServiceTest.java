package com.example.expensetracker;

import com.example.expensetracker.dto.GuestExpenseImportResult;
import com.example.expensetracker.model.Expense;
import com.example.expensetracker.model.User;
import com.example.expensetracker.repository.ExpenseRepository;
import com.example.expensetracker.repository.UserRepository;
import com.example.expensetracker.service.ExpenseService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ExpenseServiceTest {

    @Mock
    private ExpenseRepository expenseRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private ExpenseService expenseService;

    private User testUser;

    @BeforeEach
    void setUp() {
        testUser = new User();
        testUser.setId(1L);
        testUser.setUsername("testuser");
        testUser.setEmail("test@example.com");
    }

    @Test
    void testImportGuestExpenses_Success() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        when(expenseRepository.findByClientIdAndUserId("client-uuid-1", 1L)).thenReturn(Optional.empty());
        when(expenseRepository.save(any(Expense.class))).thenAnswer(invocation -> {
            Expense exp = invocation.getArgument(0);
            exp.setId(101L);
            return exp;
        });

        Expense exp1 = new Expense();
        exp1.setClientId("client-uuid-1");
        exp1.setTitle("Coffee");
        exp1.setAmount(150.0);
        exp1.setCategory("Food");
        exp1.setDate(LocalDate.now());

        GuestExpenseImportResult result = expenseService.importGuestExpenses(1L, List.of(exp1));

        assertEquals(1, result.getCreated());
        assertEquals(0, result.getAlreadyImported());
        assertEquals(0, result.getRejected());
        assertEquals(1, result.getCreatedExpenses().size());
        verify(expenseRepository, times(1)).save(any(Expense.class));
    }

    @Test
    void testImportGuestExpenses_IdempotencyDuplicate() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        Expense alreadyExisting = new Expense();
        alreadyExisting.setId(201L);
        alreadyExisting.setClientId("duplicate-uuid");

        when(expenseRepository.findByClientIdAndUserId("duplicate-uuid", 1L))
                .thenReturn(Optional.of(alreadyExisting));

        Expense expDuplicate = new Expense();
        expDuplicate.setClientId("duplicate-uuid");
        expDuplicate.setTitle("Duplicate Expense");
        expDuplicate.setAmount(200.0);
        expDuplicate.setCategory("Shopping");
        expDuplicate.setDate(LocalDate.now());

        GuestExpenseImportResult result = expenseService.importGuestExpenses(1L, List.of(expDuplicate));

        assertEquals(0, result.getCreated());
        assertEquals(1, result.getAlreadyImported());
        assertEquals(0, result.getRejected());
        assertTrue(result.getAlreadyImportedClientIds().contains("duplicate-uuid"));
        verify(expenseRepository, never()).save(any(Expense.class));
    }

    @Test
    void testImportGuestExpenses_RejectsInvalidExpense() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));

        Expense invalidExpense = new Expense();
        invalidExpense.setClientId(""); // Missing clientId
        invalidExpense.setTitle(""); // Missing title
        invalidExpense.setAmount(-10.0); // Invalid amount

        GuestExpenseImportResult result = expenseService.importGuestExpenses(1L, List.of(invalidExpense));

        assertEquals(0, result.getCreated());
        assertEquals(0, result.getAlreadyImported());
        assertEquals(1, result.getRejected());
        verify(expenseRepository, never()).save(any(Expense.class));
    }

    @Test
    void testUpdateExpense_UnauthorizedAccessPrevented() {
        when(expenseRepository.findByIdAndUserId(99L, 2L)).thenReturn(Optional.empty());

        Expense update = new Expense();
        update.setTitle("Updated Title");

        assertThrows(RuntimeException.class, () -> {
            expenseService.updateExpense(99L, 2L, update);
        });
    }

    @Test
    void testDeleteExpense_UnauthorizedAccessPrevented() {
        when(expenseRepository.findByIdAndUserId(99L, 2L)).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> {
            expenseService.deleteExpense(99L, 2L);
        });
    }
}
