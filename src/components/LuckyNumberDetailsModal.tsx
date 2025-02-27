"use client";

import {
	Button,
	Modal,
	ModalContent,
	ModalHeader,
	ModalBody,
	ModalFooter,
} from "@heroui/react";

type LuckyNumberDetailsModalProps = {
	isOpen: boolean;
	onClose: () => void;
	details: Record<string, any>; // Thông tin chi tiết từ API
};

export default function LuckyNumberDetailsModal({
	isOpen,
	onClose,
	details,
}: LuckyNumberDetailsModalProps) {
	return (
		<Modal
			isOpen={isOpen}
			onOpenChange={onClose}
			backdrop="opaque"
			size="3xl"
			classNames={{
				body: "py-6",
				backdrop: "bg-[#292f46]/50 backdrop-opacity-40",
				base: "border-[#292f46] bg-[#19172c] dark:bg-[#19172c] text-[#a8b0d3]",
				header: "border-b-[1px] border-[#292f46]",
				footer: "border-t-[1px] border-[#292f46]",
				closeButton: "hover:bg-white/5 active:bg-white/10",
			}}>
			<ModalContent>
				<ModalHeader className="flex flex-col gap-1">
					Lucky Number Details
				</ModalHeader>
				<ModalBody>
					{details ? (
						<div className="flex flex-col space-y-2">
							{Object.entries(details).map(([key, value]) => (
								<div
									key={key}
									className="flex flex-col space-y-1">
									{key !== "Avatar" && (
										<strong className="text-xl font-bold text-[#ffffff]">
											{key}:
										</strong>
									)}
									{key === "Avatar" && value ? (
										<div className="flex justify-center">
											<div
												style={{
													position: "relative",
													width: "200px",
													height: "200px",
													borderRadius: "50%",
													overflow: "hidden",
												}}>
												<iframe
													src={
														value
															? value
															: "/logo.png"
													}
													style={{
														width: "100%",
														height: "100%",
														border: "none",
													}}
												/>
												<div
													style={{
														position: "absolute",
														top: 0,
														left: 0,
														width: "100%",
														height: "100%",
														background:
															"transparent",
														cursor: "default",
													}}
												/>
											</div>
										</div>
									) : (
										<span>{value}</span>
									)}
								</div>
							))}
						</div>
					) : (
						<p>No details available.</p>
					)}
				</ModalBody>
				<ModalFooter>
					<Button onPress={onClose}>Close</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
}
