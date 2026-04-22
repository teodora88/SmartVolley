<?php

namespace App\Http\Controllers;

use App\Models\Member;
use App\Models\Payment;
use Illuminate\Http\Request;

class PaymentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $payments = Payment::when($request->member_id, function ($query, $memberId) {
            return $query->where('member_id', $memberId);
        })
            ->when($request->has('is_paid'), function ($query) use ($request) {
                return $query->where('is_paid', $request->is_paid);
            })
            ->when($request->month, function ($query, $month) {
                return $query->where('month', $month);
            })
            ->get();

        return response()->json($payments);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $fields = $request->validate([
            'month' => 'required|string|date_format:m-Y',
            'price' => 'required|numeric|min:0',
            'is_paid' => 'boolean',
            'date' => 'nullable|date|required_if:is_paid,true',
            'member_id' => 'required|exists:members,id',
        ]);

        $payment = Payment::create($fields);

        return response()->json([
            'message' => 'Uplata je uspesno kreirana!',
            'payment' => $payment,
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Payment $payment)
    {
        return response()->json($payment);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Payment $payment)
    {
        $fields = $request->validate([
            'month' => 'sometimes|string|date_format:m-Y',
            'price' => 'sometimes|numeric|min:0',
            'is_paid' => 'sometimes|boolean',
            'date' => 'nullable|date|required_if:is_paid,true',
        ]);

        $payment->update($fields);

        return response()->json([
            'message' => 'Uplata je uspesno azurirana!',
            'payment' => $payment,
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */

    // brisanje uplata nije dozvoljeno
    // uplata se automatski brise samo kada se obrise clan (cascadeOnDelete)
    public function destroy(Payment $payment)
    {
        return response()->json([
            'message' => 'Brisanje uplata nije dozvoljeno!'
        ], 403);
    }

    public function createMonthlyPayments(Request $request)
    {
        $fields = $request->validate([
            'month' => 'required|string|date_format:m-Y',
            'price' => 'required|numeric|min:0',
            'group_id' => 'required|exists:groups,id',
        ]);

        // proveri da li vec postoje uplate za taj mesec i grupu
        $existing = Payment::whereHas('member', function ($query) use ($fields) {
            $query->where('group_id', $fields['group_id']);
        })->where('month', $fields['month'])->exists();

        if ($existing) {
            return response()->json([
                'message' => 'Uplate za ovaj mesec vec postoje!'
            ], 409);
        }

        // kreiraj uplatu za svakog clana grupe
        $members = Member::where('group_id', $fields['group_id'])->get();
        foreach ($members as $member) {
            Payment::create([
                'month' => $fields['month'],
                'price' => $fields['price'],
                'is_paid' => false,
                'date' => null,
                'member_id' => $member->id,
            ]);
        }

        return response()->json([
            'message' => 'Clanarine su uspesno kreirane za sve clanove grupe!',
        ], 201);
    }
}
