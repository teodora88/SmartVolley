<?php

namespace App\Http\Controllers;

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
}
