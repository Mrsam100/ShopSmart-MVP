# Quick Fix Guide - Apply Remaining Patches

## ✅ Already Fixed (No Action Needed)
- ✅ API key exposure in geminiService.ts
- ✅ Weak ID generation utility created in utils.ts
- ✅ XSS sanitization functions created in utils.ts
- ✅ localStorage validation in App.tsx
- ✅ Stock overselling prevention in App.tsx
- ✅ Input sanitization for shop name
- ✅ Security documentation created

## 🔧 Manual Fixes Required

### Fix 1: Update POS.tsx - Add Security Imports
**File:** `components/POS.tsx`
**Line:** 8 (after other imports)

**Add:**
```typescript
import { generateSecureId, sanitizeNumber, sanitizePhone, validateDiscount } from '../utils';
```

**Find line 101:**
```typescript
id: Math.random().toString(36).substr(2, 9),
```

**Replace with:**
```typescript
id: generateSecureId(),
```

**Find line 137** (phone sanitization in shareReceipt):
```typescript
phone = manualPhone.replace(/\D/g, '');
```

**Replace with:**
```typescript
phone = sanitizePhone(manualPhone);
```

**Find line 425** (discount input):
```typescript
onChange={e => setDiscountValue(Math.max(0, Number(e.target.value)))}
```

**Replace with:**
```typescript
onChange={e => {
  const value = sanitizeNumber(Number(e.target.value), 0);
  const validated = validateDiscount(value, discountType, subtotal);
  setDiscountValue(validated);
}}
```

---

### Fix 2: Update Inventory.tsx - Add Security & Validation
**File:** `components/Inventory.tsx`
**Line:** 8 (after other imports)

**Add:**
```typescript
import { generateSecureId, sanitizeString, sanitizeNumber, validateImageFile } from '../utils';
```

**Find line 29:**
```typescript
const p = editing.id ? (editing as Product) : ({ ...editing, id: Math.random().toString(36).substr(2, 9), status: 'active' } as Product);
```

**Replace with:**
```typescript
const p = editing.id ? (editing as Product) : ({
  ...editing,
  id: generateSecureId(),
  name: sanitizeString(editing.name || ''),
  sku: editing.sku ? sanitizeString(editing.sku) : undefined,
  price: sanitizeNumber(editing.price || 0, 0),
  costPrice: sanitizeNumber(editing.costPrice || 0, 0),
  stock: Math.floor(sanitizeNumber(editing.stock || 0, 0)),
  category: sanitizeString(editing.category || 'General'),
  status: 'active'
} as Product);
```

**Find line 34** (handleImageChange function):
**Replace entire function with:**
```typescript
const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (!file) return;

  const validation = validateImageFile(file);
  if (!validation.valid) {
    alert(validation.error);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    return;
  }

  const reader = new FileReader();
  reader.onloadend = () => {
    setEditing(prev => ({ ...prev, image: reader.result as string }));
  };
  reader.onerror = () => {
    alert('Failed to read image file. Please try again.');
  };
  reader.readAsDataURL(file);
};
```

**Find line 45** (handleAddCategory):
```typescript
if (!newCatName.trim() || categories.includes(newCatName.trim())) return;
```

**Replace with:**
```typescript
const sanitizedCat = sanitizeString(newCatName);
if (!sanitizedCat.trim() || categories.includes(sanitizedCat.trim())) {
  alert('Category name is empty or already exists.');
  return;
}
```

**And update next line:**
```typescript
onUpdateCategories([...categories, sanitizedCat.trim()]);
```

**Find line 51** (handleDeleteCategory):
**Replace entire function with:**
```typescript
const handleDeleteCategory = (cat: string) => {
  // Check if any products use this category
  const productsInCategory = products.filter(p => p.category === cat);

  if (productsInCategory.length > 0) {
    alert(`Cannot delete category "${cat}". ${productsInCategory.length} product(s) are using it. Please reassign those products first.`);
    return;
  }

  onUpdateCategories(categories.filter(c => c !== cat));
  if (selectedCat === cat) setSelectedCat('All');
};
```

---

### Fix 3: Update Customers.tsx - Add Security
**File:** `components/Customers.tsx`
**Line:** 8 (after other imports)

**Add:**
```typescript
import { generateSecureId, sanitizeString, sanitizePhone, sanitizeNumber } from '../utils';
```

**Find line 24** (handleAdd function):
**Replace entire function with:**
```typescript
const handleAdd = (e: React.FormEvent) => {
  e.preventDefault();

  const sanitizedName = sanitizeString(newCust.name || '');
  const sanitizedPhone = sanitizePhone(newCust.phone || '');

  if (!sanitizedName || !sanitizedPhone) {
    alert('Please provide both name and phone number.');
    return;
  }

  if (sanitizedPhone.length < 10) {
    alert('Please enter a valid phone number with at least 10 digits.');
    return;
  }

  onAddCustomer({
    id: generateSecureId(),
    name: sanitizedName,
    phone: sanitizedPhone,
    address: '',
    notes: '',
    totalSpent: 0,
    pendingBalance: 0
  });

  setNewCust({ name: '', phone: '' });
  setShowAdd(false);
};
```

**Find line 41** (handleRepayment function):
**Replace with:**
```typescript
const handleRepayment = () => {
  if (!selectedHistoryCustomer) return;

  const amount = sanitizeNumber(repaymentAmount, 0);

  if (amount <= 0) {
    alert('Please enter a valid repayment amount.');
    return;
  }

  if (amount > selectedHistoryCustomer.pendingBalance) {
    alert(`Repayment amount ($${amount.toFixed(2)}) exceeds pending balance ($${selectedHistoryCustomer.pendingBalance.toFixed(2)}).`);
    return;
  }

  onRepayment(selectedHistoryCustomer.id, amount);
  setRepaymentAmount(0);
  setSelectedHistoryCustomer(null);
};
```

---

### Fix 4: Update Reports.tsx - Add Date Validation
**File:** `components/Reports.tsx`
**Line:** 17 (update state declarations)

**Find:**
```typescript
const [startDate, setStartDate] = useState<string>(new Date().toISOString().split('T')[0]);
const [endDate, setEndDate] = useState<string>(new Date().toISOString().split('T')[0]);
```

**Replace with:**
```typescript
const [startDate, setStartDate] = useState<string>(new Date().toISOString().split('T')[0]);
const [endDate, setEndDate] = useState<string>(new Date().toISOString().split('T')[0]);

const handleStartDateChange = (newStart: string) => {
  setStartDate(newStart);
  // Auto-adjust end date if it becomes before start date
  if (newStart > endDate) {
    setEndDate(newStart);
  }
};

const handleEndDateChange = (newEnd: string) => {
  if (newEnd < startDate) {
    alert('End date cannot be before start date');
    return;
  }
  setEndDate(newEnd);
};
```

**Find line 70:**
```typescript
onChange={(e) => setStartDate(e.target.value)}
```

**Replace with:**
```typescript
onChange={(e) => handleStartDateChange(e.target.value)}
```

**Find line 82:**
```typescript
onChange={(e) => setEndDate(e.target.value)}
```

**Replace with:**
```typescript
onChange={(e) => handleEndDateChange(e.target.value)}
```

---

## 🚀 After Applying All Fixes

### 1. Set up API Key
```bash
# Edit .env.local file
VITE_GEMINI_API_KEY=your_actual_api_key_here
```

### 2. Install Dependencies (if not done)
```bash
npm install
```

### 3. Start Dev Server
```bash
npm run dev
```

### 4. Test All Fixes

#### Security Tests:
```
1. Try: <script>alert('XSS')</script> in product name → Should be stripped
2. Try: -100 for price → Should default to 0
3. Try: Selling 50 items when only 10 in stock → Should show error
4. Try: 150% discount → Should cap at 100%
5. Try: Upload 50MB image → Should show error
6. Try: Upload .exe file → Should show error
7. Try: Delete category with products → Should show error
8. Try: Set end date before start date → Should prevent/auto-correct
```

#### Functional Tests:
```
1. Complete a sale with pending payment
2. Record repayment for customer
3. Add new product with image
4. Filter reports by date range
5. Apply per-item + global discount
6. Check stock deduction after sale
```

---

## 📝 Summary

**Files to Manually Update:**
1. ✅ `components/POS.tsx` - 3 changes
2. ✅ `components/Inventory.tsx` - 4 changes
3. ✅ `components/Customers.tsx` - 2 changes
4. ✅ `components/Reports.tsx` - 2 changes

**Estimated Time:** 15-20 minutes

**Testing Time:** 10-15 minutes

**Total Time:** ~30 minutes

---

## ⚠️ Important Notes

1. **Backup First**: Consider backing up your current code before applying fixes
2. **Test Thoroughly**: Run all security and functional tests
3. **API Key**: Don't commit .env.local to git (add to .gitignore)
4. **Image Storage**: For production, move images to external storage (not localStorage)
5. **Data Backup**: Implement export/import for user data

---

## 🆘 If You Encounter Issues

### TypeScript Errors
- Make sure all imports from `../utils` are correct
- Run `npm install` to ensure all types are available

### Runtime Errors
- Check browser console for specific error messages
- Ensure utils.ts file exists and exports all functions
- Verify all function names match exactly

### API Key Not Working
- Verify .env.local file is in root directory (same level as package.json)
- Restart dev server after updating .env.local
- Check API key is valid at https://aistudio.google.com/app/apikey

---

**Last Updated:** 2025-12-15
**Version:** 1.0.0
